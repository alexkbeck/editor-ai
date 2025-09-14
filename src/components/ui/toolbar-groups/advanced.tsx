'use client';

import { HighlighterIcon } from 'lucide-react';
import { KEYS } from 'platejs';

import { CommentToolbarButton } from '../comment-toolbar-button';
import { LineHeightToolbarButton } from '../line-height-toolbar-button';
import { MarkToolbarButton } from '../mark-toolbar-button';
import { ModeToolbarButton } from '../mode-toolbar-button';
import { MoreToolbarButton } from '../more-toolbar-button';
import { ToolbarGroup } from '../toolbar';

export function AdvancedGroup() {
  return (
    <ToolbarGroup>
      <LineHeightToolbarButton />

      {/* show|hide comments */}
      <CommentToolbarButton />
    </ToolbarGroup>
  );
}