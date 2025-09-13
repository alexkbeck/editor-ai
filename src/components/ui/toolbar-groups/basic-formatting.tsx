'use client';

import { BoldIcon, Code2Icon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';
import { KEYS } from 'platejs';

import { MarkToolbarButton } from '../mark-toolbar-button';
import { ToolbarGroup } from '../toolbar';

export function BasicFormattingGroup() {
  return (
    <ToolbarGroup>
      <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
        <BoldIcon />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
        <ItalicIcon />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={KEYS.underline} tooltip="Underline (⌘+U)">
        <UnderlineIcon />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={KEYS.strikethrough} tooltip="Strikethrough (⌘+⇧+M)">
        <StrikethroughIcon />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
        <Code2Icon />
      </MarkToolbarButton>
    </ToolbarGroup>
  );
}