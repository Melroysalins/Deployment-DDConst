export const popupConfig = {
    delete: {
      title: 'Confirm Diagram Deletion',
      dialogHeading: 'Are you sure you want to delete this entire diagram?',
      description: 'This action cannot be undone. All associated data and configurations will be permanently removed. Please confirm your decision to proceed with this deletion.',
      buttonLabel: 'Yes, delete'
    },
    save: {
      title: 'Confirm Save',
      dialogHeading: 'Are you sure you don\'t want a change?',
      description: 'Please confirm your satisfaction or let us know if any adjustments are needed.',
      buttonLabel: 'Save'
    },
    edit: {
      title: 'Editing a diagram',
      dialogHeading: 'Editing a diagram',
      description: 'Are you sure you want to edit?',
      buttonLabel: 'Edit'
    }
  };

export const ICONS_MAP = {
    'Yes, delete': 'tabler:trash',
    'Save': 'bi:check-lg',
    'Edit': 'mi:edit',
};