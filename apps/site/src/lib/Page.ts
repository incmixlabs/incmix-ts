import { PageComponentTree, RootDatasource } from "@incmix/utils";

export type Page = {
  title: string;
  route: string;
  id: string;
  site_id: string;
  pageData: PageComponentTree;
  rootDatasources: RootDatasource[];
};
