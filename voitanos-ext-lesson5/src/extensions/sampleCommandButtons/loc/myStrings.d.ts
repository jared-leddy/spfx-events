declare interface ISampleCommandButtonsCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'SampleCommandButtonsCommandSetStrings' {
  const strings: ISampleCommandButtonsCommandSetStrings;
  export = strings;
}
