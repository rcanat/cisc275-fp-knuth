import { Document, Paragraph, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';
import type { Project, Page as PageType, PageComponent } from '../types';

/* eslint-disable @typescript-eslint/no-use-before-define */

export async function generateDocx(project: Project): Promise<void> {
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      text: project.name,
      heading: HeadingLevel.HEADING_1,
    })
  );

  // Purpose
  children.push(
    new Paragraph({
      text: 'Purpose',
      heading: HeadingLevel.HEADING_2,
    })
  );
  children.push(
    new Paragraph({
      text: project.purpose || 'No purpose specified',
    })
  );

  // Page Graph (text representation)
  children.push(
    new Paragraph({
      text: 'Page Graph',
      heading: HeadingLevel.HEADING_2,
    })
  );
  
  children.push(
    new Paragraph({
      text: 'Pages:',
      heading: HeadingLevel.HEADING_3,
    })
  );
  
  for (const page of project.pages) {
    children.push(
      new Paragraph({
        text: `- ${page.name}`,
        bullet: { level: 0 },
      })
    );
  }

  children.push(
    new Paragraph({
      text: 'Routes:',
      heading: HeadingLevel.HEADING_3,
    })
  );
  
  for (const route of project.routes) {
    const sourcePage = project.pages.find(p => p.id === route.sourcePageId);
    const targetPage = project.pages.find(p => p.id === route.targetPageId);
    const routeText = `${sourcePage?.name || 'Unknown'} -> ${targetPage?.name || 'Unknown'} (${route.name})`;
    children.push(
      new Paragraph({
        text: routeText,
        bullet: { level: 0 },
      })
    );
  }

  // Page Descriptions
  children.push(
    new Paragraph({
      text: 'Page Descriptions',
      heading: HeadingLevel.HEADING_2,
    })
  );

  for (const page of project.pages) {
    children.push(...generatePageDescription(page));
  }

  // State Model
  children.push(
    new Paragraph({
      text: 'State Model',
      heading: HeadingLevel.HEADING_2,
    })
  );

  children.push(
    new Paragraph({
      text: 'Main State Attributes:',
      heading: HeadingLevel.HEADING_3,
    })
  );

  if (project.stateModel.attributes.length === 0) {
    children.push(
      new Paragraph({
        text: 'No attributes defined',
      })
    );
  } else {
    for (const attr of project.stateModel.attributes) {
      children.push(
        new Paragraph({
          text: `${attr.name}: ${attr.type} - ${attr.description || 'No description'}`,
          bullet: { level: 0 },
        })
      );
    }
  }

  children.push(
    new Paragraph({
      text: 'Secondary Dataclasses:',
      heading: HeadingLevel.HEADING_3,
    })
  );

  if (project.stateModel.secondaryDataclasses.length === 0) {
    children.push(
      new Paragraph({
        text: 'No secondary dataclasses defined',
      })
    );
  } else {
    for (const dataclass of project.stateModel.secondaryDataclasses) {
      children.push(
        new Paragraph({
          text: dataclass.name,
          heading: HeadingLevel.HEADING_4,
        })
      );
      for (const attr of dataclass.attributes) {
        children.push(
          new Paragraph({
            text: `${attr.name}: ${attr.type} - ${attr.description || 'No description'}`,
            bullet: { level: 0 },
          })
        );
      }
    }
  }

  // Logic Annotations
  children.push(
    new Paragraph({
      text: 'Logic Annotations',
      heading: HeadingLevel.HEADING_2,
    })
  );

  for (const page of project.pages) {
    if (page.ifAnnotations.length > 0 || page.forAnnotations.length > 0) {
      children.push(
        new Paragraph({
          text: `Page: ${page.name}`,
          heading: HeadingLevel.HEADING_3,
        })
      );

      if (page.ifAnnotations.length > 0) {
        children.push(
          new Paragraph({
            text: 'If Statements:',
          })
        );
        for (const annotation of page.ifAnnotations) {
          children.push(
            new Paragraph({
              text: annotation.description,
              bullet: { level: 0 },
            })
          );
        }
      }

      if (page.forAnnotations.length > 0) {
        children.push(
          new Paragraph({
            text: 'For Loops:',
          })
        );
        for (const annotation of page.forAnnotations) {
          children.push(
            new Paragraph({
              text: annotation.description,
              bullet: { level: 0 },
            })
          );
        }
      }
    }
  }

  for (const route of project.routes) {
    if (route.ifAnnotations.length > 0 || route.forAnnotations.length > 0) {
      const sourcePage = project.pages.find(p => p.id === route.sourcePageId);
      const targetPage = project.pages.find(p => p.id === route.targetPageId);
      children.push(
        new Paragraph({
          text: `Route: ${sourcePage?.name || 'Unknown'} -> ${targetPage?.name || 'Unknown'}`,
          heading: HeadingLevel.HEADING_3,
        })
      );

      if (route.ifAnnotations.length > 0) {
        children.push(
          new Paragraph({
            text: 'If Statements:',
          })
        );
        for (const annotation of route.ifAnnotations) {
          children.push(
            new Paragraph({
              text: annotation.description,
              bullet: { level: 0 },
            })
          );
        }
      }

      if (route.forAnnotations.length > 0) {
        children.push(
          new Paragraph({
            text: 'For Loops:',
          })
        );
        for (const annotation of route.forAnnotations) {
          children.push(
            new Paragraph({
              text: annotation.description,
              bullet: { level: 0 },
            })
          );
        }
      }
    }
  }

  const doc = new Document({
    sections: [{
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${project.name.replace(/\s+/g, '_')}_design.docx`);
}

function generatePageDescription(page: PageType): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: page.name,
      heading: HeadingLevel.HEADING_3,
    })
  );

  if (page.stateDescription) {
    paragraphs.push(
      new Paragraph({
        text: `State Changes: ${page.stateDescription}`,
      })
    );
  }

  paragraphs.push(
    new Paragraph({
      text: 'Components:',
    })
  );

  if (page.components.length === 0) {
    paragraphs.push(
      new Paragraph({
        text: 'No components',
      })
    );
  } else {
    for (const component of page.components) {
      paragraphs.push(
        new Paragraph({
          text: getComponentDescription(component),
          bullet: { level: 0 },
        })
      );
    }
  }

  return paragraphs;
}

function getComponentDescription(component: PageComponent): string {
  switch (component.type) {
    case 'Header':
      return `Header (Level ${component.level}): ${component.content}`;
    case 'Text':
      return `Text: ${component.content}`;
    case 'TextBox':
      return `TextBox: ${component.name} (default: ${component.defaultValue})`;
    case 'TextArea':
      return `TextArea: ${component.name} (default: ${component.defaultValue})`;
    case 'CheckBox':
      return `CheckBox: ${component.name} (default: ${component.defaultValue})`;
    case 'SelectBox':
      return `SelectBox: ${component.name} (options: ${component.options.join(', ')})`;
    case 'Button':
      return `Button: ${component.label} -> ${component.route}`;
    default:
      return 'Unknown component';
  }
}
