declare global {
  namespace Intl {
    interface Locale extends InstanceType<typeof import("@formatjs/intl-locale").Locale> {}
    interface LocaleConstructor {
      new (tag: string, options?: Intl.LocaleOptions): Locale;
    }
  }
}
