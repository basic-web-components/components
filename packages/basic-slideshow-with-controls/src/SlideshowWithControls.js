import Slideshow from '../../basic-slideshow/src/Slideshow';
import PlayControlsMixin from '../../basic-component-mixins/src/PlayControlsMixin';

/**
 * An extension of
 * [basic-slideshow](../basic-slideshow) that adds play controls
 * via [PlayControlsMixin](../basic-component-mixins/docs/PlayControlsMixin.md).
 *
 * @extends Slideshow
 * @mixes PlayControlsMixin
 */
class SlideshowWithControls extends PlayControlsMixin(Slideshow) {}
customElements.define('basic-slideshow-with-controls', SlideshowWithControls);

export default SlideshowWithControls;
