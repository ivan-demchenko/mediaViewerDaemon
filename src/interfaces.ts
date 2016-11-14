export interface UserConfig {
    outputDir:string,
    srcPaths:string[]
}

enum TFileType {}
export type FileType = TFileType & string;

enum TFormattedImgSize {}
export type FormattedImgSize = TFormattedImgSize & string;

enum TFileName {}
export type FileName = TFileName & string;

enum TFileSrc {}
export type FileSrc = TFileSrc & string;

enum TFileDest {}
export type FileDest = TFileDest & string;

enum TSrcDir {}
export type SrcDir = TSrcDir & string;