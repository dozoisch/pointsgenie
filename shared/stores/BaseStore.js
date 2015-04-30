import { Store } from "flummox";

class BaseStore extends Store {
  constructor(flux, initialState) {
    super();
    this.state = initialState;
  }

  getInitialState() {
    return {};
  }

  handleBeginAsyncRequest() {
    this.setState({ isLoading: true });
  }

  handleFinishAsyncRequest() {
    this.setState({ isLoading: false });
  }

  handleErrorAsyncRequest(err) {
    this.setState({ isLoading: false });
  }

  isLoading() {
    return this.state.isLoading;
  }
}

export default BaseStore;
