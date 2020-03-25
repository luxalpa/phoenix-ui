import { BehaviorSubject, Subject } from "rxjs";

type DestructionFn = () => void;

function AppComponent() {
  let numClicked$ = new BehaviorSubject(0);

  const addButton = document.createElement("button");
  addButton.addEventListener("click", () => {
    numClicked$.next(numClicked$.value + 1);
  });
  addButton.appendChild(document.createTextNode("Add"));

  const removeButton = document.createElement("button");
  removeButton.addEventListener("click", () => {
    if (numClicked$.value > 0) {
      numClicked$.next(numClicked$.value - 1);
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
  prop$: Subject<number>
): DestructionFn {
  const div = document.createElement("div");
  const text = document.createTextNode("Entry X");
  div.appendChild(text);
  parent.appendChild(div);

  console.log("Component");
  const subs = prop$.subscribe(v => {
    text.data = `Entry X / ${v}`;
    console.log("Changed");
  });

  return () => {
    subs.unsubscribe();
    div.remove();
  };
}

function bootstrap() {
  AppComponent();
}

bootstrap();
