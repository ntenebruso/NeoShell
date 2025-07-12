export interface Module {
    component: () => JSX.Element;
}

export class ModuleManager {
    private modules = new Map<string, Module>();

    public registerModule(id: string, module: Module) {
        return this.modules.set(id, module);
    }

    public hasModule(id: string) {
        return this.modules.has(id);
    }

    public getModule(id: string) {
        const mod = this.modules.get(id);

        if (mod == undefined) {
            throw new Error(`Module ${id} was not found`);
        }

        return mod;
    }

    public getAllModules() {
        return Array.from(this.modules.values());
    }
}
