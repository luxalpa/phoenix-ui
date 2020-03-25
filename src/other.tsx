import { phxCreateElement } from "@/main";
import { Observable, Subject } from "rxjs";

interface Props {
  stuff: Observable<string>;
}

export function OtherComponent(props: Props) {
  return <div>{props.stuff}</div>;
}
