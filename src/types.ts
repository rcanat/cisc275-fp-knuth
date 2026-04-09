export type ComponentType = 'Text' | 'TextBox' | 'TextArea' | 'CheckBox' | 'SelectBox' | 'Button' | 'Header';

import type { CSSProperties } from 'react';

export interface ComponentStyle {
  color?: CSSProperties['color'];
  backgroundColor?: CSSProperties['backgroundColor'];
  fontSize?: CSSProperties['fontSize'];
  fontFamily?: CSSProperties['fontFamily'];
  border?: CSSProperties['border'];
  borderRadius?: CSSProperties['borderRadius'];
  padding?: CSSProperties['padding'];
  margin?: CSSProperties['margin'];
  display?: CSSProperties['display'];
  flexDirection?: CSSProperties['flexDirection'];
  justifyContent?: CSSProperties['justifyContent'];
  alignItems?: CSSProperties['alignItems'];
  gap?: CSSProperties['gap'];
}

export interface BaseComponent {
  id: string;
  type: ComponentType;
  style: ComponentStyle;
}

export interface TextComponent extends BaseComponent {
  type: 'Text';
  content: string;
}

export interface TextBoxComponent extends BaseComponent {
  type: 'TextBox';
  name: string;
  defaultValue: string;
}

export interface TextAreaComponent extends BaseComponent {
  type: 'TextArea';
  name: string;
  defaultValue: string;
}

export interface CheckBoxComponent extends BaseComponent {
  type: 'CheckBox';
  name: string;
  defaultValue: boolean;
}

export interface SelectBoxComponent extends BaseComponent {
  type: 'SelectBox';
  name: string;
  options: string[];
  defaultValue: string;
}

export interface ButtonComponent extends BaseComponent {
  type: 'Button';
  label: string;
  route: string;
}

export interface HeaderComponent extends BaseComponent {
  type: 'Header';
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export type PageComponent = TextComponent | TextBoxComponent | TextAreaComponent | CheckBoxComponent | SelectBoxComponent | ButtonComponent | HeaderComponent;

export interface PageStyle {
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  padding?: string;
}

export interface IfAnnotation {
  id: string;
  description: string;
}

export interface ForAnnotation {
  id: string;
  description: string;
}

export interface Page {
  id: string;
  name: string;
  components: PageComponent[];
  style: PageStyle;
  stateDescription: string;
  ifAnnotations: IfAnnotation[];
  forAnnotations: ForAnnotation[];
  position: { x: number; y: number };
}

export interface Route {
  id: string;
  sourcePageId: string;
  targetPageId: string;
  name: string;
  stateDescription: string;
  ifAnnotations: IfAnnotation[];
  forAnnotations: ForAnnotation[];
}

export interface StateAttribute {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface SecondaryDataclass {
  id: string;
  name: string;
  attributes: StateAttribute[];
}

export interface StateModel {
  attributes: StateAttribute[];
  secondaryDataclasses: SecondaryDataclass[];
}

export interface Project {
  id: string;
  name: string;
  purpose: string;
  pages: Page[];
  routes: Route[];
  stateModel: StateModel;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'dashboard' | 'overview' | 'graph' | 'page' | 'state' | 'export';

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  currentPageId: string | null;
  viewMode: ViewMode;
}

export type Action =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_CURRENT_PROJECT'; payload: string | null }
  | { type: 'SET_CURRENT_PAGE'; payload: string | null }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'ADD_PAGE'; payload: { projectId: string; page: Page } }
  | { type: 'UPDATE_PAGE'; payload: { projectId: string; page: Page } }
  | { type: 'DELETE_PAGE'; payload: { projectId: string; pageId: string } }
  | { type: 'ADD_ROUTE'; payload: { projectId: string; route: Route } }
  | { type: 'UPDATE_ROUTE'; payload: { projectId: string; route: Route } }
  | { type: 'DELETE_ROUTE'; payload: { projectId: string; routeId: string } }
  | { type: 'ADD_COMPONENT'; payload: { projectId: string; pageId: string; component: PageComponent } }
  | { type: 'UPDATE_COMPONENT'; payload: { projectId: string; pageId: string; component: PageComponent } }
  | { type: 'DELETE_COMPONENT'; payload: { projectId: string; pageId: string; componentId: string } }
  | { type: 'UPDATE_STATE_MODEL'; payload: { projectId: string; stateModel: StateModel } }
  | { type: 'ADD_PAGE_IF_ANNOTATION'; payload: { projectId: string; pageId: string; annotation: IfAnnotation } }
  | { type: 'DELETE_PAGE_IF_ANNOTATION'; payload: { projectId: string; pageId: string; annotationId: string } }
  | { type: 'ADD_PAGE_FOR_ANNOTATION'; payload: { projectId: string; pageId: string; annotation: ForAnnotation } }
  | { type: 'DELETE_PAGE_FOR_ANNOTATION'; payload: { projectId: string; pageId: string; annotationId: string } }
  | { type: 'ADD_ROUTE_IF_ANNOTATION'; payload: { projectId: string; routeId: string; annotation: IfAnnotation } }
  | { type: 'DELETE_ROUTE_IF_ANNOTATION'; payload: { projectId: string; routeId: string; annotationId: string } }
  | { type: 'ADD_ROUTE_FOR_ANNOTATION'; payload: { projectId: string; routeId: string; annotation: ForAnnotation } }
  | { type: 'DELETE_ROUTE_FOR_ANNOTATION'; payload: { projectId: string; routeId: string; annotationId: string } };
