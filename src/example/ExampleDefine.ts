namespace example {
    let _moduleOwner: ModuleOwner;
    export let moduleOwner: ModuleOwner = _moduleOwner;

    export function init() {
        if (!_moduleOwner) {
            _moduleOwner = new ModuleOwner();
        }
    }
}