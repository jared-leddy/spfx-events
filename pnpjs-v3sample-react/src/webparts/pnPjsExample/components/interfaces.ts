// create File item to work with it internally
export interface IFile {
  Id: number;
  Name: string;
  Size: number;
  Unit: string;
  Section: string;
  ApprovalStatus: string;
  SSIC: string;
  FileLeafRef?: string;
  File?: IResponseFile;
  Title?: string;
  SeriesTitle?: string;
  FilePlanKey?: string;
  SeriesDescription?: string;
}

// create PnP JS response interface for File
export interface IResponseFile {
  Length: number;
}

// create PnP JS response interface for Item
export interface IResponseItem {
  Id: number;
  Name: string;
  Size: number;
  Unit: string;
  Section: string;
  Approval_Status: string;
  SSIC: string;
  FileLeafRef?: string;
  File?: IResponseFile;
  Title: string;
}

export interface FilePlanItemOptions {
  Id?: number;
  Unit?: string;
  FilePlanKey: string;
  SSIC?: string;
  SeriesTitle?: string;
  SeriesDescription?: string;
}