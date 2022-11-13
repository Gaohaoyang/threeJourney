import { AxesHelper } from 'three'

export default class Axes {
  constructor() {
    const axesHelper = new AxesHelper(5)
    axesHelper.position.set(10, 0, 0)
    return axesHelper
  }
}
