export interface ChangeAvatarFields {
  uploadAvatar: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  closeChangeAvatar: () => void;
  isChangeAvatarActive: boolean;
}
