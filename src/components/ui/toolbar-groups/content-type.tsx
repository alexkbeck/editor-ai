'use client';

import { WandSparklesIcon } from 'lucide-react';

import { AIToolbarButton } from '../ai-toolbar-button';
import { FontSizeToolbarButton } from '../font-size-toolbar-button';
import { InsertToolbarButton } from '../insert-toolbar-button';
import { ToolbarGroup } from '../toolbar';
import { TurnIntoToolbarButton } from '../turn-into-toolbar-button';

export function ContentTypeGroup() {
  return (
    <ToolbarGroup>
      <AIToolbarButton tooltip="AI commands">
        <WandSparklesIcon />
      </AIToolbarButton>
      <TurnIntoToolbarButton />
      <InsertToolbarButton />
      <FontSizeToolbarButton />
    </ToolbarGroup>
  );
}