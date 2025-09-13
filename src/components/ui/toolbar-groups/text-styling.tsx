'use client';

import { BaselineIcon, PaintBucketIcon } from 'lucide-react';
import { KEYS } from 'platejs';

import { FontColorToolbarButton } from '../font-color-toolbar-button';
import { ToolbarGroup } from '../toolbar';

export function TextStylingGroup() {
  return (
    <ToolbarGroup>
      <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
        <BaselineIcon />
      </FontColorToolbarButton>
      <FontColorToolbarButton nodeType={KEYS.backgroundColor} tooltip="Background color">
        <PaintBucketIcon />
      </FontColorToolbarButton>
    </ToolbarGroup>
  );
}