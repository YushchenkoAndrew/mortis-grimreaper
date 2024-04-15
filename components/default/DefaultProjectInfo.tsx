import { basePath } from '../../config';
import { LinkData } from '../../lib/common/types/api';
export interface DefaultProjectInfoProps {
  href?: string;
  links?: LinkData[];
  description: string;
}

export default function DefaultProjectInfo(props: DefaultProjectInfoProps) {
  return (
    <>
      <p className="text-dark">
        Description: <small className="text-muted">{props.description}</small>
      </p>
      <p className="text-dark">
        {'Source: '}
        {props.href ? (
          <a
            className="font-weight-bold"
            href={props.href}
            onClick={() =>
              localStorage.getItem('id')
                ? fetch(
                    `${basePath}/api/view/media?id=${localStorage.getItem(
                      'id',
                    )}`,
                    { method: 'PATCH' },
                  )
                    .then((res) => null)
                    .catch((err) => null)
                : null
            }
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        ) : null}
        {props.links
          ? props.links.map((item, key) => (
              <a
                className="font-weight-bold ml-1"
                href={item.link}
                key={key}
                onClick={() =>
                  localStorage.getItem('id')
                    ? fetch(
                        `${basePath}/api/view/media?id=${localStorage.getItem(
                          'id',
                        )}`,
                        { method: 'PATCH' },
                      )
                        .then((res) => null)
                        .catch((err) => null)
                    : null
                }
                target="_blank"
                rel="noreferrer"
              >
                {item.name === 'main' && !props.href ? 'Github' : item.name}
              </a>
            ))
          : null}
      </p>
    </>
  );
}
