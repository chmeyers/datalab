import { FileManagerType, FileManagerFactory } from "../file-manager-factory/file-manager-factory";
import { ColumnType } from "../../components/item-list/item-list";

/**
 * Represents a cell in a notebook.
 */
export interface NotebookCell {
  cell_type: string;
  execution_count: number;
  metadata: object;
  outputs: string[];
  source: string;
}

export enum DatalabFileType {
  DIRECTORY,
  FILE,
  NOTEBOOK,
}

/**
 * Unique identifier for a file object.
 */
export class DatalabFileId {
  private static _delim = '/';

  path: string;
  source: FileManagerType;

  constructor(path: string, source: FileManagerType) {
    this.path = path;
    this.source = source;
  }

  public static fromString(path: string) {
    const tokens = path.split(this._delim);
    // Allow an empty path token
    if (tokens.length === 1) {
      tokens.push('');
    }
    const source = tokens.shift() as string;
    return new DatalabFileId(tokens.join(this._delim),
      FileManagerFactory.fileManagerNameToType(source));
  }

  public toString() {
    return FileManagerFactory.fileManagerTypetoString(this.source) +
      DatalabFileId._delim + this.path;
  }
}

export class NotebookContent {
  public static EMPTY_NOTEBOOK_CONTENT = `{
    "cells": [
    ],
    "metadata": {},
    "nbformat": 4,
    "nbformat_minor": 0
  }
  `;

  public cells: NotebookCell[];
  metadata?: object;
  nbformat?: number;
  // tslint:disable-next-line:variable-name
  nbformat_minor?: number;

  constructor(cells: NotebookCell[], metadata?: object, nbformat?: number, nbformatMinor?: number) {
    this.cells = cells;
    this.metadata = metadata;
    this.nbformat = nbformat;
    this.nbformat_minor = nbformatMinor || 0;
  }

  public static fromString(content: string, kernel?: string) {
    const json = JSON.parse(content);
    if (kernel !== undefined) {
      json.metadata.kernelspec = KernelManager.getKernelSpec(kernel);
    }
    return new NotebookContent(json.cells, json.metadata, json.nbformat, json.nbformatMinor);
  }
}

/**
 * Represents a file object that can be displayed in the file browser.
 */
export abstract class DatalabFile {
  icon: string;
  id: DatalabFileId;
  name: string;
  type: DatalabFileType;

  constructor(id: DatalabFileId, name: string, type: DatalabFileType, icon?: string) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.icon = icon || '';
  }

  public getColumnValues(): ColumnType[] {
    return [this.name];
  }

  public getPreviewName(): string {
    if (this.type === DatalabFileType.NOTEBOOK) {
      return 'notebook';
    }
    return '';
  }

  public getInlineDetailsName(): string {
    return '';
  }
}

