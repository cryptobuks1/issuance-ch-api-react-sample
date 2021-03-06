import { decorate, observable, action, computed } from 'mobx';
import { VideoConference } from '../helpers/agent';

class VideoConferenceStore {

  loadingCount = 0;
  slotRegistry = [];

  get loading() {
    return this.loadingCount > 0;
  }

  get slots() {
    const slots = {
    }

    this.slotRegistry.forEach(slot => {
      const date = slot.date.split('T')[0];

      if (!(date in slots)) {
        slots[date] = [];
      }

      slots[date].push(slot);
    })

    return slots;
  }

  loadSlots() {
    this.loadingCount++;

    this.slotRegistry = [];

    return VideoConference.list()
      .then(action(slots => {
        this.slotRegistry = slots;
      }))
      .finally(action(() => { this.loadingCount--; }))
    ;
  }

  bookSlot(slotId, subscriptionId) {
    this.loadingCount++;

    return VideoConference.book(slotId, subscriptionId)
      .then(action(res => {
        console.info('bookSlot', res);
      }))
      .finally(action(() => { this.loadingCount--; }))
    ;
  }

}
decorate(VideoConferenceStore, {
  loadingCount: observable,
  slotRegistry: observable,
  loading: computed,
  slots: computed,
  loadSlots: action,
  bookSlot: action,
});

export default new VideoConferenceStore();
