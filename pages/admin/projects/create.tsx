import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import Container from '../../../components/Container/Container';
import Header from '../../../components/Header/Header';
import Navbar from '../../../components/Navbar/Navbar';
import NavbarItem from '../../../components/Navbar/NavbarItem';
import Radio from '../../../components/Radio/Radio';
import { Config } from '../../../config';
import { NAVIGATION } from '../../../constants';
import {
  PROJECT_FORM_STEPS,
  PROJECT_TYPES_OPTIONS,
} from '../../../components/constants/projects';
import ProjectResourceForm from '../../../components/Form/Project/ProjectResourceForm';
import ProjectSourceForm from '../../../components/Form/Project/ProjectSourceForm';
import Steps from '../../../components/Steps/Steps';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { projectFormStore } from '../../../redux/reducer/admin/projects/project-form.reducer';
import { ProjectStepEnum } from '../../../entities/project/types/project-step.enum';

export default function () {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.projects.form);

  return (
    <>
      <Header title="Admin project create"></Header>

      <Container
        Navbar={
          <Navbar
            Item={NavbarItem}
            navigation={NAVIGATION.admin}
            avatar={Config.self.github}
          />
        }
        Actions={<Breadcrumbs path={['Home', 'Projects']} />}
      >
        <div className="flex mx-auto max-w-5xl w-full">
          <div className="h-full w-1/3 mt-8">
            <Steps value={form.step} states={PROJECT_FORM_STEPS} />
          </div>

          <div className="flex flex-col w-full pl-6 border-l">
            {/* <ProjectResourceForm
              value={ProjectStepEnum.resources}
              next={() => null}
            /> */}
            <ProjectSourceForm next={() => null} />
          </div>
        </div>
      </Container>
    </>
  );
}

// export const getServerSideProps = defaultServerSideHandler;
