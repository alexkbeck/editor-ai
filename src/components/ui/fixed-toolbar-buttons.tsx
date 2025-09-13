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
  const { visibleGroups, shouldShowMore } = useResponsiveToolbar();

  const renderGroup = (groupName: string) => {
    switch (groupName) {
      case 'document-actions':
        return <DocumentActionsGroup key={groupName} />;
      case 'content-type':
        return <ContentTypeGroup key={groupName} />;
      case 'basic-formatting':
        return <BasicFormattingGroup key={groupName} />;
      case 'text-styling':
        return <TextStylingGroup key={groupName} />;
      case 'paragraph':
        return <ParagraphGroup key={groupName} />;
      case 'rich-content':
        return <RichContentGroup key={groupName} />;
      case 'advanced':
        return <AdvancedGroup key={groupName} />;
      default:
        return null;
    }
  };

  const renderHiddenGroups = () => {
    const allGroups = ['document-actions', 'content-type', 'basic-formatting', 'text-styling', 'paragraph', 'rich-content', 'advanced'];
    const hiddenGroups = allGroups.filter(group => !visibleGroups.includes(group));

    return hiddenGroups.map(groupName => (
      <div key={`hidden-${groupName}`} className="hidden">
        {renderGroup(groupName)}
      </div>
    ));
  };

  if (readOnly) {
    return (
      <div className="flex w-full">
        <div className="grow" />
        <AdvancedGroup />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center">
      {visibleGroups.map(groupName => renderGroup(groupName))}

      {shouldShowMore && (
        <EnhancedMoreToolbarButton
          secondaryTools={renderHiddenGroups()}
          showSecondaryInDropdown={true}
        />
      )}

      <div className="grow" />
    </div>
  );
}
