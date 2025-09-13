'use client';

import { ArrowUpToLineIcon } from 'lucide-react';
import { ExportToolbarButton } from '../export-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from '../history-toolbar-button';
import { ImportToolbarButton } from '../import-toolbar-button';
import { ToolbarGroup } from '../toolbar';

export function DocumentActionsGroup() {
  return (
    <ToolbarGroup>
      <UndoToolbarButton />
      <RedoToolbarButton />
      <ExportToolbarButton>
        <ArrowUpToLineIcon />
      </ExportToolbarButton>
      <ImportToolbarButton />
    </ToolbarGroup>
  );
}