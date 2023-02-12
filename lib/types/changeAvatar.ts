export interface ChangeAvatarFields {
  uploadAvatar: () => Promise<void>;
  deleteAvatar: () => Promise<void>;
  closeChangeAvatar: () => void;
  isChangeAvatarActive: boolean;
  avatarRef: React.RefObject<HTMLInputElement>;
}
