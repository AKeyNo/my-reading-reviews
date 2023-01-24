import { Dispatch, SetStateAction } from 'react';
import { Database } from './supabase';

export interface ListEditorFields {
  book: any;
  userBookInformation: Database['public']['Tables']['read_list']['Row'];
  setUserBookInformation: React.Dispatch<
    SetStateAction<Database['public']['Tables']['read_list']['Row']>
  >;
  closeListEditor: () => void;
  setIsInformationOnline: Dispatch<SetStateAction<boolean>>;
}
