import { LightningElement, api } from 'lwc';

const HOVER_DELAY_MS = 200;

export default class ProductPillPopover extends LightningElement {
    @api productName;
    @api quantity;
    @api unitPrice;
    @api totalPrice;
    @api description;
    @api popoverPosition = 'above'; // 'above' or 'below'

    showPopover = false;
    hoverTimeout;

    get displayName() {
        return this.productName || '';
    }

    get popoverContainerClass() {
        return this.popoverPosition === 'below'
            ? 'popover-container popover-below'
            : 'popover-container popover-above';
    }

    handleMouseEnter() {
        this.hoverTimeout = setTimeout(() => {
            this.showPopover = true;
        }, HOVER_DELAY_MS);
    }

    handleMouseLeave() {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
        this.showPopover = false;
    }

    disconnectedCallback() {
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
    }
}
