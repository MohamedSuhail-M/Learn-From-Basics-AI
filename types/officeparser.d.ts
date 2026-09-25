declare module 'officeparser' {
  export function parseOffice(
    fileBuffer: Buffer,
    callback: (data: string, err: any) => void
  ): void;
}
