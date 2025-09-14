'use client';

import * as React from 'react';

import { useEditorReadOnly } from 'platejs/react';

import { useResponsiveToolbar } from '@/hooks/use-responsive-toolbar';

import { EnhancedMoreToolbarButton } from './enhanced-more-toolbar-button';
import {
  AdvancedGroup,
  BasicFormattingGroup,
  ContentTypeGroup,
  DocumentActionsGroup,
  ParagraphGroup,
  RichContentGroup,
  TextStylingGroup,
} from './toolbar-groups';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  const renderGroup = (groupName: string) => {
    switch (groupName) {
      case 'document-actions':
        return <DocumentActionsGroup key={groupName} />;
      case 'content-type':
        return <ContentTypeGroup key={groupName} />;
      case 'rich-content':
        return <RichContentGroup key={groupName} />;
      case 'advanced':
        return <AdvancedGroup key={groupName} />;
      default:
        return null;
    }
  };

  if (readOnly) {
    return (
      <div className="flex w-full">
        <div className="grow" />
        <AdvancedGroup />
      </div>
    );
  }

  // Top row: Most common actions (made more prominent)
  const topRowGroups = ['document-actions', 'content-type', 'rich-content', 'advanced'];

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-center gap-1">
        {topRowGroups.map(groupName => (
          <div key={groupName} className="[&_button]:h-10 [&_button]:min-w-10 [&_button]:px-2.5">
            {renderGroup(groupName)}
          </div>
        ))}
      </div>
    </div>
  );
}
