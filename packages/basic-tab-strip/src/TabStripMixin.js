import createSymbol from '../../basic-component-mixins/src/createSymbol';
import renderArrayAsElements from '../../basic-component-mixins/src/renderArrayAsElements';
import symbols from '../../basic-component-mixins/src/symbols';
import toggleClass from '../../basic-component-mixins/src/toggleClass';


// Symbols for private data members on an element.
const tabPositionSymbol = createSymbol('tabPosition');


// Used to assign unique IDs to tabs for ARIA purposes.
let idCount = 0;


/* Exported function extends a base class with TabStrip. */
export default (base) => {

  /**
   * A template mixin which adds strip of tabs for selecting one of the
   * component's children.
   *
   * The component creates a tab to represent each of its light DOM children.
   * The tab name is obtained by examining the children for an `aria-label`
   * property.
   *
   * Use tabs when you want to provide a large set of options or elements than
   * can comfortably fit inline, the options can be coherently grouped into pages,
   * and you want to avoid making the user navigate to a separate page. Tabs work
   * best if you only have a small handful of pages, say 2–7.
   *
   * The basic-tab-strip component does not define how a selected child is
   * represented. If you're looking for the standard behavior of just showing only
   * the selected child, you can use this component in combination with the
   * separate [basic-modes](../basic-modes/) component. A typical arrangement:
   *
   *     <basic-tab-strip>
   *       <basic-modes aria-label="Panels">
   *         <div aria-label="One">Page one</div>
   *         <div aria-label="Two">Page two</div>
   *         <div aria-label="Three">Page three</div>
   *       </basic-modes>
   *     </basic-tab-strip>
   *
   * The above combination is so common it is provided as a single component,
   * [basic-tabs](../basic-tabs/).
   *
   * The user can select a tab with the mouse or touch, as well as by through the
   * keyboard. Each tab appears as a separate button in the tab order.
   * Additionally, if the focus is currently on a tab, the user can quickly
   * navigate between tabs with the left/right arrow keys (or, if the tabs are
   * in vertical position, the up/down arrow keys).
   *
   * By default, the tabs are shown grouped to the left, where each tab is only
   * as big as necessary. You can apply the `spread` CSS class to a
   * basic-tab-strip element for a variant appearance in which the available width
   * of the element is divided up equally among tabs.
   *
   * The GenericMixin default styling of the tab strip will present the classic
   * skeumorphic look of rounded tabs attached to a surface. You can remove this
   * styling by setting the `GenericMixin` property/attribute to false.
   */
  class TabStrip extends base {

    constructor() {
      super();

      this.$.tabs.addEventListener('click', event => {
        const tab = event.target;
        const tabIndex = this.tabs.indexOf(tab);
        if (tabIndex >= 0) {
          this.selectedIndex = tabIndex;
        }
      });

      // Listen to keydown events on the tabs, not on pages.
      this.$.tabs.addEventListener('keydown', event => {
        const handled = this[symbols.keydown](event);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
      });

      // Set defaults.
      if (typeof this.tabPosition === 'undefined') {
        this.tabPosition = this[symbols.defaults].tabPosition;
      }
    }

    [symbols.applySelection](item, selected) {
      if (super[symbols.applySelection]) { super[symbols.applySelection](item, selected); }
      const index = this.items.indexOf(item);
      // See if the corresponding tab has already been created.
      // If not, the correct tab will be selected when it gets created.
      const tabs = this.tabs;
      if (tabs && tabs.length > index) {
        const tab = this.tabs[index];
        if (tab) {
          applySelectionToTab(tab, selected);
        }
      }
    }

    get [symbols.defaults]() {
      const defaults = super[symbols.defaults] || {};
      defaults.tabPosition = 'top';
      return defaults;
    }

    get tabs() {
      return [].slice.call(this.$.tabs.querySelectorAll('.tab'));
    }

    itemsChanged() {
      if (super.itemsChanged) { super.itemsChanged(); }

      const baseId = this.id ?
        "_" + this.id + "Panel" :
        "_panel";

      // Confirm that items have at least a default role and ID for ARIA purposes.
      this.items.forEach(item => {
        if (!item.getAttribute('role')) {
          item.setAttribute('role', 'tabpanel');
        }
        if (!item.id) {
          item.id = baseId + idCount++;
        }
      });

      // Create tabs.
      const selectedItem = this.selectedItem;
      renderArrayAsElements(this.items, this.$.tabs, (item, element) => {
        if (!element) {
          element = document.createElement('button');
          element.classList.add('tab');
          element.classList.add('style-scope');
          element.classList.add('basic-tab-strip');
          element.setAttribute('role', 'tab');
        }
        element.id = item.id + '_tab';
        element.textContent = item.getAttribute('aria-label');

        // Point tab and panel at each other.
        element.setAttribute('aria-controls', item.id);
        item.setAttribute('aria-labelledby', element.id);

        applySelectionToTab(element, item === selectedItem);

        return element;
      });
    }

    [symbols.keydown](event) {
      const handled = super[symbols.keydown] && super[symbols.keydown](event);
      if (handled) {
        // If the event resulted in a change of selection, move the focus to the
        // newly-selected tab.
        this.tabs[this.selectedIndex].focus();
      }
      return handled;
    }

    /**
     * The position of the tab strip relative to the element's children. Valid
     * values are "top", "left", "right", and "bottom".
     *
     * @default "top"
     * @type {string}
     */
    get tabPosition() {
      return this[tabPositionSymbol];
    }
    set tabPosition(position) {
      this[tabPositionSymbol] = position;

      this.reflectAttribute('tab-position', position);

      // Physically reorder the tabs and pages to reflect the desired arrangement.
      // We could change the visual appearance by reversing the order of the flex
      // box, but then the visual order wouldn't reflect the document order, which
      // determines focus order. That would surprise a user trying to tab through
      // the controls.
      const firstElement = (position === 'top' || position === 'left') ?
        this.$.tabs :
        this.$.pages;
      const lastElement = (position === 'top' || position === 'left') ?
        this.$.pages :
        this.$.tabs;
      if (firstElement.nextSibling !== lastElement) {
        this.shadowRoot.insertBefore(firstElement, lastElement);
      }

      this.navigationAxis = (position === 'top' || position === 'bottom') ?
        'horizontal' :
        'vertical';
    }

    get template() {
      const baseTemplate = super.template || '';
      return `
        <style>
        :host {
          display: -webkit-flex;
          display: flex;
          -webkit-flex-direction: column;
          flex-direction: column;
          position: relative;
        }

        /*
         * Avoid having tab container stretch across. User won't be able to see
         * it, but since it handles the keyboard, in Mobile Safari a tap on the
         * container background will cause the region to flash. Aligning the
         * region collapses it down to hold its contents.
         */
        #tabs {
          /* For IE bug (clicking tab produces gap between tab and page). */
          display: -webkit-flex;
          display: flex;
          /*
           * Try to obtain fast-tap behavior on all tabs.
           * See https://webkit.org/blog/5610/more-responsive-tapping-on-ios/.
           */
          touch-action: manipulation;
        }
        :host(:not(.spread)) #tabs {
          -webkit-align-self: flex-start;
          align-self: flex-start;
        }

        #pages {
          display: -webkit-flex;
          display: flex;
          -webkit-flex: 1;
          flex: 1;
          -webkit-flex-direction: column;
          flex-direction: column;
        }

        #pages ::slotted(*) {
          display: -webkit-flex;
          display: flex;
          -webkit-flex: 1;
          flex: 1;
        }

        .tab {
          cursor: pointer;
          display: inline-block;
          font-family: inherit;
          font-size: inherit;
          position: relative;
        }

        /* Left/right positions */
        :host([tab-position="left"]),
        :host([tab-position="right"]) {
          -webkit-flex-direction: row;
          flex-direction: row;
        }
        :host([tab-position="left"]) #tabs,
        :host([tab-position="right"]) #tabs {
          -webkit-flex-direction: column;
          flex-direction: column;
        }

        /* Spread variant */
        :host(.spread) #tabs {
          -webkit-align-items: stretch;
          align-items: stretch;
        }
        :host(.spread) .tab {
          flex: 1;
        }

        /* Generic style */
        :host([generic=""]) #pages {
          background: white;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }

        :host([generic=""]) .tab {
          background: white;
          border: 1px solid #ccc;
          margin: 0;
          padding: 0.5em 0.75em;
          transition: border-color 0.25s;
        }

        :host([generic=""]) .tab.selected {
          border-color: #ccc;
          opacity: 1;
        }

        :host([generic=""]) .tab:hover {
          background-color: #eee;
        }

        /* GenericMixin, top/bottom positions */
        :host([generic=""][tab-position="top"]) .tab:not(:last-child),
        :host([generic=""][tab-position="bottom"]) .tab:not(:last-child) {
          margin-right: 0.2em;
        }

        /* GenericMixin, top position */
        :host([generic=""][tab-position="top"]) .tab {
          border-radius: 0.25em 0.25em 0 0;
          margin-bottom: -1px;
        }
        :host([generic=""][tab-position="top"]) .tab.selected {
          border-bottom-color: transparent;
        }

        /* GenericMixin, bottom position */
        :host([generic=""][tab-position="bottom"]) .tab {
          border-radius: 0 0 0.25em 0.25em;
          margin-top: -1px;
        }
        :host([generic=""][tab-position="bottom"]) .tab.selected {
          border-top-color: transparent;
        }

        /* GenericMixin, left/right positions */
        :host([generic=""][tab-position="left"]) .tab:not(:last-child),
        :host([generic=""][tab-position="right"]) .tab:not(:last-child) {
          margin-bottom: 0.2em;
        }

        /* GenericMixin, left position */
        :host([generic=""][tab-position="left"]) .tab {
          border-radius: 0.25em 0 0 0.25em;
          margin-right: -1px;
        }
        :host([generic=""][tab-position="left"]) .tab.selected {
          border-right-color: transparent;
        }

        /* GenericMixin, right position */
        :host([generic=""][tab-position="right"]) .tab {
          border-radius: 0 0.25em 0.25em 0;
          margin-left: -1px;
        }
        :host([generic=""][tab-position="right"]) .tab.selected {
          border-left-color: transparent;
        }
        </style>

        <div id="tabs" role="tablist"></div>
        <div id="pages">
          ${baseTemplate}
        </div>
      `;
    }

  }

  return TabStrip;
};


function applySelectionToTab(tab, selected) {
  toggleClass(tab, 'selected', selected);
  tab.setAttribute('aria-selected', selected);
}
