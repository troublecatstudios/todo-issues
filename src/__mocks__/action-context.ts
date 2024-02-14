import { ActionContext } from "../action-context";

export type SetActionContextParams = Partial<ActionContext>;

const defaultContext: ActionContext = {
  headCommit: '',
  ref: '',
  pullRequestNumber: undefined,
  isPullRequest: false,
};
let stubActionContext = defaultContext;

export const setActionContext = (contextOptions:SetActionContextParams = {}) => {
  stubActionContext = Object.assign(stubActionContext, contextOptions)
};

export const getActionContext = (): ActionContext => stubActionContext;

export const clearRepositoryContext = () => {
  stubActionContext = defaultContext;
}
