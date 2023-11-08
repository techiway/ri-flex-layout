import { StyleDefinition } from "../style-utils/style-utils.service";

export abstract class StyleGenerator {

  /** Whether to cache the generated output styles */
  shouldCache = true;
  abstract buildStyles(input: string, parent?: Object): StyleDefinition;

  /** Build the styles given an input string and configuration object from a host */
  abstract buildStyles(input: string, parent?: Object): StyleDefinition;

  /**
   * Run a side effect computation given the input string and the computed styles
   * from the build task and the host configuration object
   * NOTE: This should be a no-op unless an algorithm is provided in a subclass
   */
  sideEffect(_input: string, _styles: StyleDefinition, _parent?: Object) {
  }
}
