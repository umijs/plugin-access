import { InitialState } from 'umi';

export default function accessFactory(initialState: InitialState) {
  console.log(initialState);
  return {
    readArticle: true,
    updateArticle: () => false,
  };
}
