import { useDispatch, useSelector } from "react-redux";
import { ProjectInfo } from "../../../config/placeholder";
import DefaultFooter from "../../default/DefaultFooter";
import DefaultProjectInfo from "../../default/DefaultProjectInfo";
import InputDouble from "../../Inputs/InputDouble";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import InputText from "../../Inputs/InputText";
import ListEntity from "../../Inputs/ListEntity";

export interface DefaultPreviewFooterProps {
  root?: string;
  readFrom: string;
}

export default function DefaultPreviewFooter(props: DefaultPreviewFooterProps) {
  const dispatch = useDispatch();
  const preview = useSelector((state: any) => state[props.readFrom] as any);

  return preview.flag === "Link" || preview.flag === "Docker" ? (
    <div className="d-flex justify-content-center mb-3">
      <div className="w-100">
        <h4 className="font-weight-bold mb-3">Redirect</h4>
        <InputTemplate className="mb-3" label="Link">
          <InputName
            char="http://"
            root={props.root}
            readFrom={`${props.readFrom}_links_main`}
            required
            placeholder={ProjectInfo.link}
          />
        </InputTemplate>

        {preview.flag === "Docker" ? (
          <InputTemplate className="mb-3" label="Repo">
            <InputDouble
              char={["$", ":"]}
              root={props.root}
              readFrom={[
                `${props.readFrom}_repo_name`,
                `${props.readFrom}_repo_version`,
              ]}
              placeholder={["grimreapermortis/demo", "demo"]}
            />
          </InputTemplate>
        ) : null}
      </div>
    </div>
  ) : (
    <div className="d-flex justify-content-center mb-3">
      <div className="w-100">
        <h4 className="font-weight-bold mb-3">Footer</h4>
        <InputTemplate className="mb-3" label="Note">
          <InputText
            root={props.root}
            readFrom={`${props.readFrom}_note`}
            placeholder={ProjectInfo.note}
          />
        </InputTemplate>

        <InputTemplate className="mb-3" label="Link">
          <InputName
            char="http://"
            root={props.readFrom}
            readFrom={`${props.readFrom}_links_main`}
            placeholder={ProjectInfo.link}
            required
          />
        </InputTemplate>

        <InputTemplate className="mb-3" label="Additional Links">
          <InputList
            char={["http://", "@"]}
            readFrom={`${props.readFrom}_links`}
            placeholder={[ProjectInfo.link, ProjectInfo.name]}
            // name={["link", "name"]}
            // onChange={onNewLinkAdd}
          />
          <ul className="list-group">
            {Object.entries(preview.links).map(([name, link], i) =>
              name != "main" ? (
                <div key={i} className="row">
                  <ListEntity
                    char={["http://", "@"]}
                    value={[name, link]}
                    onChange={() => {
                      dispatch({
                        type: `${props.readFrom}_links_del`.toUpperCase(),
                        value: name,
                      });
                    }}
                  />
                </div>
              ) : null
            )}
          </ul>
        </InputTemplate>

        <DefaultFooter name={preview.name || ProjectInfo.name}>
          <DefaultProjectInfo
            links={Object.entries(preview.links).map(([name, link]) => ({
              name,
              link: link && `http://${link}`,
            }))}
            description={preview.note || ProjectInfo.note}
          />
        </DefaultFooter>
      </div>
    </div>
  );
}
