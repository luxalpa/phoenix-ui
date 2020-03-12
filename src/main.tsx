import { OtherComponent } from "@/other";
import { BehaviorSubject, Subject } from "rxjs";
import * as rxjs from "rxjs/operators";
import { isArray } from "util";

export interface VNode {
  tag: string | ComponentFn;
  params: Record<string, any> | null;
  children: PhxNode[];
}

export type TextNode = string | number;

export type PhxNode = VNode | TextNode | Subject<any>;

export type ComponentFn = (props?: any) => PhxNode;

function phxCreateElement(
  tag: string,
  params: Record<string, any>,
  ...children: VNode[]
): VNode {
  return {
    tag,
    params,
    children
  };
}

function AppComponent(): VNode {
  const num$ = new BehaviorSubject(0);
  const entries$ = new BehaviorSubject<string[]>([]);

  function add() {
    num$.next(num$.value + 1);
    entries$.value.push("Element");
    entries$.next(entries$.value);
    console.log("Adding");
  }

  return (
    <div>
      <button onclick={add}>Add entry</button>
      <div>Number of entries: {num$}</div>
      {entries$.pipe(
        rxjs.map(value =>
          value.map((d, i) => (
            <div>
              {d} ({i + 1}/{num$})
            </div>
          ))
        )
      )}
    </div>
  );
}

function Hello() {
  return <OtherComponent stuff="hello" />;
}

function bootstrap() {
  const v = AppComponent();
  document.body.appendChild(buildNode(v));

  console.log("App", v);
}

function buildNode(n: PhxNode): ChildNode | DocumentFragment {
  if (typeof n === "string") {
    return document.createTextNode(n);
  }
  if (typeof n === "number") {
    return document.createTextNode(n.toString());
  }

  if (n instanceof Subject) {
    const refNode = document.createComment("");
    const fragment = document.createDocumentFragment();
    fragment.appendChild(refNode);
    let nodes: ChildNode[] = [];

    n.subscribe(value => {
      for (let node of nodes) {
        node.remove();
      }
      nodes = [];
      if (Array.isArray(value)) {
        for (let e of value) {
          nodes.push(buildNode(e) as ChildNode);
        }
      } else {
        nodes.push(buildNode(value) as ChildNode);
      }
      refNode.after(...nodes);
    });
    return fragment;
  }

  if (typeof n.tag !== "string") {
    console.log("Error", n);
    throw new Error("Custom Components not yet implemented");
  }
  const el = document.createElement(n.tag);
  for (let child of n.children) {
    el.appendChild(buildNode(child));
  }
  if (n.params !== null) {
    for (let [key, value] of Object.entries(n.params)) {
      if (key == "onclick") {
        el.addEventListener("click", value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  return el;
}

bootstrap();
