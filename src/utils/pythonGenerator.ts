import type { Project, Page, PageComponent, SecondaryDataclass } from '../types';

/* eslint-disable @typescript-eslint/no-use-before-define */

export function generatePythonCode(project: Project): string {
  const lines: string[] = [];
  
  // Imports
  lines.push('from drafter import *');
  lines.push('from dataclasses import dataclass, field');
  lines.push('');
  
  // Secondary dataclasses
  for (const dataclass of project.stateModel.secondaryDataclasses) {
    lines.push(...generateDataclass(dataclass));
    lines.push('');
  }
  
  // Main State dataclass
  lines.push('@dataclass');
  lines.push('class State:');
  if (project.stateModel.attributes.length === 0) {
    lines.push('    pass');
  } else {
    for (const attr of project.stateModel.attributes) {
      lines.push(`    ${attr.name}: ${attr.type}${getDefaultValue(attr.type)}`);
    }
  }
  lines.push('');
  
  // Route functions for each page
  for (const page of project.pages) {
    lines.push(...generateRouteFunction(page, project));
    lines.push('');
  }
  
  // Start server
  lines.push('start_server(State())');
  
  return lines.join('\n');
}

function generateDataclass(dataclass: SecondaryDataclass): string[] {
  const lines: string[] = [];
  lines.push('@dataclass');
  lines.push(`class ${dataclass.name}:`);
  
  if (dataclass.attributes.length === 0) {
    lines.push('    pass');
  } else {
    for (const attr of dataclass.attributes) {
      lines.push(`    ${attr.name}: ${attr.type}${getDefaultValue(attr.type)}`);
    }
  }
  
  return lines;
}

function getDefaultValue(type: string): string {
  if (type === 'str') {
    return ' = ""';
  } else if (type === 'int') {
    return ' = 0';
  } else if (type === 'float') {
    return ' = 0.0';
  } else if (type === 'bool') {
    return ' = False';
  } else if (type.startsWith('list[')) {
    return ' = field(default_factory=list)';
  } else if (type.startsWith('dict[')) {
    return ' = field(default_factory=dict)';
  }
  return ' = None';
}

function generateRouteFunction(page: Page, project: Project): string[] {
  const lines: string[] = [];
  
  // Collect input parameters from components
  const params = getInputParameters(page);
  
  // Function signature
  const paramList = params.length > 0 ? ', ' + params.join(', ') : '';
  lines.push('@route');
  lines.push(`def ${page.name}(state: State${paramList}) -> Page:`);
  
  // State updates from parameters
  if (params.length > 0) {
    for (const param of params) {
      const paramName = param.split(':')[0].trim();
      lines.push(`    state.${paramName} = ${paramName}`);
    }
  }
  
  // Return Page with components
  lines.push('    return Page(state, [');
  
  for (const component of page.components) {
    const componentCode = generateComponentCode(component, project);
    if (componentCode) {
      lines.push(`        ${componentCode},`);
    }
  }
  
  lines.push('    ])');
  
  return lines;
}

function getInputParameters(page: Page): string[] {
  const params: string[] = [];
  
  for (const component of page.components) {
    if (component.type === 'TextBox') {
      params.push(`${component.name}: str = ""`);
    } else if (component.type === 'TextArea') {
      params.push(`${component.name}: str = ""`);
    } else if (component.type === 'CheckBox') {
      params.push(`${component.name}: bool = False`);
    } else if (component.type === 'SelectBox') {
      params.push(`${component.name}: str = ""`);
    }
  }
  
  return params;
}

function generateComponentCode(component: PageComponent, project: Project): string | null {
  switch (component.type) {
    case 'Header':
      return `Header("${escapeString(component.content)}", ${component.level})`;
    case 'Text':
      return `Text("${escapeString(component.content)}")`;
    case 'TextBox':
      return `TextBox("${component.name}", state.${component.name})`;
    case 'TextArea':
      return `TextArea("${component.name}", state.${component.name})`;
    case 'CheckBox':
      return `CheckBox("${component.name}", state.${component.name})`;
    case 'SelectBox': {
      const options = component.options.map(opt => `"${escapeString(opt)}"`).join(', ');
      return `SelectBox("${component.name}", [${options}], state.${component.name})`;
    }
    case 'Button': {
      const targetPage = project.pages.find(p => p.name === component.route);
      if (targetPage) {
        return `Button("${escapeString(component.label)}", ${component.route})`;
      }
      return `Button("${escapeString(component.label)}", home)`;
    }
    default:
      return null;
  }
}

function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
