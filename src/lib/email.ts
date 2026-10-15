// The e-mail address never appears in the HTML: the page carries reversed parts and assembles them on click (spec §14).
const reverse = (s: string) => [...s].reverse().join('');

export const encodeAddress = (address: string): string[] => address.split('@').map(reverse);

export const assembleAddress = (parts: string[]): string => parts.map(reverse).join('@');
