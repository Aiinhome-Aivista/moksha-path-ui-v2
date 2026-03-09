export interface RoleButton {
  id: RoleOption;
  label: string;
}

export type RoleOption = 'student' | 'parent' | 'teacher' | 'institution' | 'group';

export interface SelectRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

export interface AcademicDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubjects?: () => void;
}

interface SelectSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn?: () => void;
}
