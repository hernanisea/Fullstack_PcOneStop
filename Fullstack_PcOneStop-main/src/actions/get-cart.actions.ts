import { getCartFromLS } from "../helpers/local-storage.helpers";
export async function getCart() {
  return Promise.resolve(getCartFromLS());
}
