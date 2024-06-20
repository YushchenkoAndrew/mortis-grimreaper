import { arrayMove } from '@dnd-kit/sortable';
import {
  faAddressCard,
  faFile,
  faPenToSquare,
  faSquare,
  faSquareCheck,
} from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsisVertical,
  faPlus,
  faSquareCheck as faSquareCheckSolid,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useRouter } from 'next/router';
import { ReactNode, useMemo, useRef } from 'react';
import { Config } from '../../../../config';
import { AdminAttachmentEntity } from '../../../../lib/attachment/entities/admin-attachment.entity';
import { AttachmentEntity } from '../../../../lib/attachment/entities/attachment.entity';
import { useAppDispatch, useAppSelector } from '../../../../lib/common/store';
import { ObjectLiteral } from '../../../../lib/common/types';
import ListFormGraggable from '../../Draggable/ListFormDraggable';
import TableFormGraggable from '../../Draggable/TableFormDraggable';
import DropdownFormElement from '../../Elements/DropdownFormElement';
import InputFormElement from '../../Elements/InputFormElement';
import InputListFormElement from '../../Elements/InputListFormElement';
import MenuFormElement from '../../Elements/MenuFormElement';
import TextareaFormElement from '../../Elements/TextareaFormElement';
import NoneFormPreview from '../../Previews/NoneFormPreview';
import TagFormPreview from '../../Previews/TagFormPreview';

type AttachmentT = AttachmentEntity & { updated_at: string };

export interface TaskFormPreviewProps {
  className?: string;
}

export default function TaskFormPreviewPage(props: TaskFormPreviewProps) {
  const form = useAppSelector((state) => state.dashboard.task);
  const stages = useAppSelector((state) => state.dashboard.index._stages); // prettier-ignore
  // const errors = useValidate(AdminTaskEntity, form);

  const actions: ObjectLiteral = useMemo(() => {
    return stages.reduce((acc, curr) => ((acc[curr.id] = curr.name), acc), {});
  }, [stages]);

  const formIdRef = useRef<string>(null);
  formIdRef.current = form.id;

  return (
    <div className="flex mt-2 mx-5 my-6">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex w-full items-center">
          <input className="w-0 p-0 m-0 border-0 outline-0" type="color" />
          <FontAwesomeIcon
            className="text-xl mr-2 text-gray-300"
            icon={faAddressCard}
          />
          <InputFormElement
            className="w-full"
            placeholder="Task Name"
            value={form.name}
            onChange={(e) => null}
            setOptions={{
              inputPadding: 'py-1.5',
              inputFont: 'text-xl font-bold cursor-pointer focus:cursor-text',
              inputFontColor: 'text-gray-300 placeholder:text-gray-400 ',
              inputRing: 'ring-0 focus:ring-2 ring-gray-800',
              inputFocus: 'focus:ring-blue-700',
            }}
          />
        </div>
        <TextareaFormElement
          name={
            <div className="flex text-sm items-center mr-2 font-semibold">
              Description
            </div>
          }
          rows={4}
          placeholder="This input provides a brief and clear synopsis of this task"
          noSuggestion
          value={form.description}
          onChange={(e) => null}
          setOptions={{
            inputRing: 'ring-0 focus:ring-2 ring-gray-800',
            inputFocus: 'focus:ring-blue-700',
          }}
        />

        {/* <div className="flex flex-col mb-8"> */}
        <ListFormGraggable
          name={
            <div className="flex w-full mb-2 text-sm justify-between items-center text-gray-300">
              <span className="font-semibold">Attached links</span>
              <FontAwesomeIcon
                className="text-sm p-1 hover:bg-gray-700 cursor-pointer"
                icon={faPlus}
                onClick={() => null}
              />
            </div>
          }
          iconComponent={({ link }) => (
            <img
              className="h-5 w-5 mr-2"
              src={`${Config.self.base.api}/icon?url=${encodeURIComponent(
                link,
              )}`}
            />
          )}
          noSuggestion
          preview={['name', 'link']}
          placeholder={[
            'Displayed link name',
            'http://localhost:8000/projects',
          ]}
          values={form.links}
          onChange={(key, value, index) => null}
          onClick={(e) => window.open(e.link, '_blank')}
          onDelete={(index) => null}
          onSubmit={(e) => null}
        />
        {/* </div> */}

        <div className="flex flex-col mb-8">
          <div className="flex w-full mr-2 mb-2 text-sm justify-between items-center text-gray-300">
            <span className="font-semibold">Attached files</span>
            <MenuFormElement
              // className="-mr-1"
              name={
                <FontAwesomeIcon
                  className="text-sm py-1 px-2.5 cursor-pointer"
                  icon={faEllipsisVertical}
                />
              }
              actions={{
                upload: 'Upload File',
                // delete: 'Delete File',
              }}
              onChange={(action) => {}}
              setOptions={{
                buttonPadding: ' ',
                noChevronDown: true,
                buttonColor: 'hover:bg-gray-700',
              }}
              // itemComponent={props.itemComponent}
            />
          </div>

          <TableFormGraggable
            className={`rounded-md ${
              form.attachments?.length ? 'block' : 'hidden'
            }`}
            columns={{ name: 'Name', updated_at: 'Last updated' }}
            data={form.attachments as AttachmentT[]}
            setOptions={{ overlayClassName: 'dark' }}
            onClick={(e: AttachmentT) => window.open(e._url(), '_blank')}
            firstComponent={(props) =>
              props.row.type ? props.children : <span className="pl-7 py-6" />
            }
            dataComponent={{
              name: (attachment) => (
                <span
                  className={`group flex h-full whitespace-nowrap text-gray-300`}
                >
                  <FontAwesomeIcon
                    className="text-gray-400 text-lg mr-2"
                    icon={faFile}
                  />
                  {attachment.name}
                  <div id={attachment.id}></div>
                </span>
              ),
              updated_at: () => moment().toNow(),
            }}
          />
        </div>

        <ListFormGraggable
          className={form.contexts?.length ? 'block' : 'hidden'}
          name={
            <div className="flex w-full mb-2 text-sm justify-between items-center text-gray-300">
              <span className="font-semibold">Checklist</span>
              <MenuFormElement
                name={
                  <FontAwesomeIcon
                    className="text-sm py-1 px-2.5 cursor-pointer"
                    icon={faEllipsisVertical}
                  />
                }
                actions={{
                  // upload: 'Upload File',
                  new: 'Add new item',
                  delete: 'Delete checklist',
                }}
                onChange={(action) => {}}
                setOptions={{
                  buttonPadding: ' ',
                  noChevronDown: true,
                  buttonColor: 'hover:bg-gray-700',
                }}
                // itemComponent={props.itemComponent}
              />
            </div>
          }
          iconComponent={(e) => (
            <FontAwesomeIcon
              className="h-5 w-5 mr-1.5 text-gray-300"
              icon={e.evaluate() ? faSquareCheckSolid : faSquare}
              onClick={() => null}
            />
          )}
          hidden={[false, true]}
          preview={['name', 'value']}
          noSuggestion
          placeholder={[
            'Displayed link name',
            'http://localhost:8000/projects',
          ]}
          values={form.fields || []}
          onChange={() => null}
          onDelete={() => null}
          onSubmit={() => null}
        />
      </div>

      <div className="flex flex-col w-full max-w-72 py-4 ml-4 space-y-4">
        <div className="flex mb-5 items-center justify-between">
          <MenuFormElement
            name={actions[form.stage_id]}
            actions={actions}
            onChange={(dst_stage_id: string) => null}
            setOptions={{
              buttonPadding: 'py-1.5 px-3',
              buttonColor:
                'border border-gray-600 bg-transparent hover:bg-gray-700',
              buttonTextColor: 'text-gray-300',
            }}
          />

          <MenuFormElement
            // className="mr-2"
            name={
              <FontAwesomeIcon
                className="text-sm py-2 px-3 cursor-pointer"
                icon={faEllipsisVertical}
              />
            }
            actions={{
              // status: `Make task ${}`,
              delete: 'Delete this task',
            }}
            onChange={(action) => {}}
            setOptions={{
              buttonPadding: ' ',
              noChevronDown: true,
              buttonColor: 'hover:bg-gray-700',
            }}
            // itemComponent={props.itemComponent}
          />
        </div>

        <DetailView
          name="Owner"
          value={
            <>
              <img
                src={form.owner?._avatar()}
                className={`mr-2 h-5 w-5 ${form.owner ? '' : 'hidden'}`}
                alt=""
              />
              <span className="text-sm">{form.owner?.name}</span>
              <NoneFormPreview hidden={!!form.owner} />
            </>
          }
        />

        <DetailView
          name="Tags"
          value={
            <div className="flex w-full  justify-between">
              <div className="flex flex-wrap space-x-1">
                <span className="hidden" />
                {form.tags.map((e) => (
                  <TagFormPreview key={e.id} name={e.name} />
                ))}
                <NoneFormPreview hidden={!!form.tags?.length} />
              </div>

              <DropdownFormElement
                name={<FontAwesomeIcon icon={faPenToSquare} />}
                contextComponent={
                  <InputListFormElement
                    name="Tags"
                    placeholder="Provide alternate names: test"
                    value={''}
                    values={form.tags.map((e) => e.name)}
                    onChange={(e) => null}
                    onSubmit={(e, index) => null}
                  />
                }
                setOptions={{
                  noChevronDown: true,
                  buttonPadding: 'p-1',
                  buttonColor: 'bg-gray-800 hover:bg-gray-700',
                  panelWidth: 'w-72',
                  panelPadding: 'py-2 px-3',
                }}
              />
            </div>
          }
        />

        <DetailView
          name="Checklist"
          value={
            form.contexts?.length ? (
              <div className="flex text-sm items-center w-full">
                <FontAwesomeIcon icon={faSquareCheck} />
                <span className="ml-2 font-semibold">
                  {form.contexts[0].outOf().join('/')}
                </span>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <NoneFormPreview />
                <FontAwesomeIcon
                  className="p-1 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer"
                  icon={faPlus}
                  onClick={() => null}
                />
              </div>
            )
          }
        />
      </div>
    </div>
  );
}

function DetailView(props: { name: ReactNode; value: ReactNode }) {
  return (
    <div className="flex w-full items-center text-gray-300">
      <span className="w-full max-w-36 text-xs font-bold">{props.name}</span>
      <div className="flex w-full items-center">{props.value}</div>
    </div>
  );
}
