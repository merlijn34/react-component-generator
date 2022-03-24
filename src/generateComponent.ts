import {window, Uri} from 'vscode';

import {
  writeFile,
  getSetting,
  readDirectory,
} from './utilities';
import {
  typesTemplate,
  stylesTemplate,
  storiesTemplate,
  indexTemplate,
} from './templates';
import {Language, StyleLanguage} from './types';

async function directoryToAddComponent(uri: Uri) {
  const {path} = uri;

  // If user clicked on a components folder, we want to add our new component there
  if (path.endsWith('components')) {
    return path;
    // If user clicks on a parent folder, we want to add our component to ParentFolder/components
  } else if (await readDirectory(path)) {
    return path.concat('/components');
  }

  // Otherwise, we want to work in the ./components folder
  const pathArray = path.split('/');
  pathArray.pop();
  const newPath = pathArray.join('/');

  if (newPath.endsWith('components')) {
    return newPath;
  }

  return newPath.concat('/components');
}

async function writeComponentFiles(directory: string, componentName: string) {
  const language = getSetting<Language>('language', Language.typeScript);
  const stylesLanguage = getSetting<StyleLanguage>(
    'stylesLanguage',
    StyleLanguage.ts
  );
  const createStoriesFile = getSetting<boolean>('createStoriesFile', false);
  const verboseStoriesComments = getSetting<boolean>(
    'verboseStoriesComments',
    true
  );

  // Write index file
  writeFile(
    `${directory}/${componentName}/index.${language}x`,
    indexTemplate(componentName)
  );
  
  // Write types file
  writeFile(
    `${directory}/${componentName}/types.${language}`,
    typesTemplate(componentName)
  );

  // Write style file
  writeFile(
    `${directory}/${componentName}/styles.${stylesLanguage}`,
    stylesTemplate(componentName)
  );

  // Write stories file
  if (createStoriesFile) {
    writeFile(
      `${directory}/${componentName}/${componentName}.stories.${language}x`,
      storiesTemplate(componentName, verboseStoriesComments)
    );
  }
}

// This is the function that gets registered to our command
export async function generateComponent(uri?: Uri) {
  if (!uri) {
    return window.showErrorMessage('No file path found.');
  }

  const componentName = await window.showInputBox({
    prompt: 'Component name',
  });

  if (!componentName) {
    return window.showErrorMessage('No component name passed');
  }

  const directory = await directoryToAddComponent(uri);

  writeComponentFiles(directory, componentName);
}
