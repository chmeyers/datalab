/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import { BigQueryFileManager, BigQueryPublicFileManager }
  from '../bigquery-file-manager/bigquery-file-manager';
import { DriveFileManager, SharedDriveFileManager } from '../drive-file-manager/drive-file-manager';
import { GithubFileManager } from '../github-file-manager/github-file-manager';
import { JupyterFileManager } from '../jupyter-file-manager/jupyter-file-manager';
import { FileManager } from '../file-manager/file-manager';
import { FileManagerType } from './file-manager-type';

interface FileManagerConfig {
  typeClass: new () => FileManager;
  displayIcon: string;
  displayName: string;
  name: string;
  path: string;
}

/**
 * Maintains and gets the static FileManager singleton.
 */
export class FileManagerFactory {

  /**
   * Dependency custom element for ApiManager
   */
  private static _fileManagerConfig = new Map<FileManagerType, FileManagerConfig>([
    [
      FileManagerType.BIG_QUERY, {
        displayIcon: 'datalab-icons:bigquery-logo',
        displayName: 'BigQuery',
        name: 'bigquery',
        path: 'modules/bigquery-file-manager/bigquery-file-manager.html',
        typeClass: BigQueryFileManager,
      }
    ], [
      FileManagerType.BIG_QUERY_PUBLIC, {
        displayIcon: 'datalab-icons:bigquery-logo',
        displayName: 'Public Datasets',
        name: 'bigqueryPublic',
        path: 'modules/bigquery-file-manager/bigquery-file-manager.html',
        typeClass: BigQueryPublicFileManager,
      }
    ], [
      FileManagerType.DRIVE, {
        displayIcon: 'datalab-icons:drive-logo',
        displayName: 'My Drive',
        name: 'drive',
        path: 'modules/drive-file-manager/drive-file-manager.html',
        typeClass: DriveFileManager,
      }
    ], [
      FileManagerType.GITHUB, {
        displayIcon: 'datalab-icons:github-logo',
        displayName: 'Github',
        name: 'github',
        path: 'modules/github-file-manager/github-file-manager.html',
        typeClass: GithubFileManager,
      }
    ], [
      FileManagerType.JUPYTER, {
        displayIcon: 'datalab-icons:local-disk',
        displayName: 'Local Disk',
        name: 'jupyter',
        path: 'modules/jupyter-file-manager/jupyter-file-manager.html',
        typeClass: JupyterFileManager,
      }
    ], [
      FileManagerType.SHARED_DRIVE, {
        displayIcon: 'folder-shared',
        displayName: 'Shared on Drive',
        name: 'sharedDrive',
        path: 'modules/drive-file-manager/drive-file-manager.html',
        typeClass: SharedDriveFileManager,
      }
    ]
  ]);

  private static _fileManagers: { [fileManagerType: string]: FileManager } = {};

  /** Get the default FileManager. */
  public static getInstance() {
    return FileManagerFactory.getInstanceForType(FileManagerType.JUPYTER);
  }

  public static getInstanceForType(fileManagerType: FileManagerType) {
    const config = this.getFileManagerConfig(fileManagerType);
    if (!FileManagerFactory._fileManagers[config.name]) {

      FileManagerFactory._fileManagers[fileManagerType] = new config.typeClass();
    }

    return FileManagerFactory._fileManagers[fileManagerType];
  }

  public static getFileManagerConfig(type: FileManagerType) {
    const config = this._fileManagerConfig.get(type);
    if (!config) {
      throw new Error('Unknown FileManagerType: ' + type.toString());
    }
    return config;
  }

}
