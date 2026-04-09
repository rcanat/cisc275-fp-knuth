import { generatePythonCode } from "../src/utils/pythonGenerator";
import type { Project } from "../src/types";
import { v4 as uuidv4 } from 'uuid';

describe('Python Generator', () => {
    test('generates basic imports and State class', () => {
        const project: Project = {
            id: uuidv4(),
            name: 'Test Project',
            purpose: 'Testing',
            pages: [],
            routes: [],
            stateModel: {
                attributes: [
                    {
                        id: uuidv4(),
                        name: 'counter',
                        type: 'int',
                        description: 'A counter',
                    },
                ],
                secondaryDataclasses: [],
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const code = generatePythonCode(project);

        expect(code).toContain('from drafter import *');
        expect(code).toContain('from dataclasses import dataclass, field');
        expect(code).toContain('@dataclass');
        expect(code).toContain('class State:');
        expect(code).toContain('counter: int = 0');
        expect(code).toContain('start_server(State())');
    });

    test('generates secondary dataclass', () => {
        const project: Project = {
            id: uuidv4(),
            name: 'Test Project',
            purpose: 'Testing',
            pages: [],
            routes: [],
            stateModel: {
                attributes: [],
                secondaryDataclasses: [
                    {
                        id: uuidv4(),
                        name: 'Todo',
                        attributes: [
                            {
                                id: uuidv4(),
                                name: 'title',
                                type: 'str',
                                description: 'Title',
                            },
                            {
                                id: uuidv4(),
                                name: 'done',
                                type: 'bool',
                                description: 'Done status',
                            },
                        ],
                    },
                ],
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const code = generatePythonCode(project);

        expect(code).toContain('class Todo:');
        expect(code).toContain('title: str = ""');
        expect(code).toContain('done: bool = False');
    });

    test('generates route function for page', () => {
        const pageId = uuidv4();
        const project: Project = {
            id: uuidv4(),
            name: 'Test Project',
            purpose: 'Testing',
            pages: [
                {
                    id: pageId,
                    name: 'home',
                    components: [
                        {
                            id: uuidv4(),
                            type: 'Header',
                            content: 'Welcome',
                            level: 1,
                            style: {},
                        },
                    ],
                    style: {},
                    stateDescription: '',
                    ifAnnotations: [],
                    forAnnotations: [],
                    position: { x: 0, y: 0 },
                },
            ],
            routes: [],
            stateModel: {
                attributes: [],
                secondaryDataclasses: [],
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const code = generatePythonCode(project);

        expect(code).toContain('@route');
        expect(code).toContain('def home(state: State) -> Page:');
        expect(code).toContain('return Page(state, [');
        expect(code).toContain('Header("Welcome", 1)');
    });
});
