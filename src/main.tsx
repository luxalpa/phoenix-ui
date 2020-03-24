type SubscriptionFn<T> = (v: T) => void;
type DestructionFn = () => void;

class Reactive<T> {
  value: T;
  private readonly subscribers: SubscriptionFn<T>[];

  constructor(value: T) {
    this.value = value;
    this.subscribers = [];
  }

  set(v: T): void {
    this.value = v;
    for (const sub of this.subscribers) {
      sub(v);
    }
  }

  subscribe(fn: SubscriptionFn<T>): DestructionFn {
    this.subscribers.push(fn);
    fn(this.value);
    return () => {
      this.subscribers.splice(
        this.subscribers.findIndex(v => v === fn),
        1
      );
    };
  }
}

function reactive<T>(value: T): Reactive<T> {
  return new Reactive<T>(value);
}

function AppComponent() {
  let numClicked$ = reactive(0);

  const addButton = document.createElement("button");
  addButton.addEventListener("click", () => {
    numClicked$.set(numClicked$.value + 1);
  });
  addButton.appendChild(document.createTextNode("Add"));

  const removeButton = document.createElement("button");
  removeButton.addEventListener("click", () => {
    if (numClicked$.value > 0) {
      numClicked$.set(numClicked$.value - 1);
    }
  });
  removeButton.appendChild(document.createTextNode("Remove"));

  let p = numClicked$.value;
  let elements: DestructionFn[] = [];
  numClicked$.subscribe(v => {
    if (v > p) {
      for (let i = v; i > p; i--) {
        elements.push(ToDoEntryComponent(document.body, numClicked$));
      }
    } else if (p > v) {
      const elementsToRemove = elements.splice(v);
      for (let fn of elementsToRemove) {
        fn();
      }
    }
    p = v;
  });

  document.body.appendChild(addButton);
  document.body.appendChild(removeButton);
}

function ToDoEntryComponent(
  parent: Node,
  prop$: Reactive<number>
): DestructionFn {
  const div = document.createElement("div");
  const text = document.createTextNode("Entry X");
  div.appendChild(text);
  parent.appendChild(div);

  console.log("Component");
  let p = -1;
  const subs = prop$.subscribe(v => {
    if (p == v) {
      return;
    }
    text.data = `Entry X / ${v}`;
    console.log("Changed");
    p = v;
  });

  return () => {
    subs();
    div.remove();
  };
}

function bootstrap() {
  AppComponent();
}

bootstrap();
