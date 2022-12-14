import React from 'react';
import style from './log.module.scss';
import Iconify from 'components/Iconify';

export default function Message() {
  return (
    <>
      <section className={style.logMessage}>
        <div className={style.imgContainer}>
          <img src={`/static/mock-images/avatars/avatar_4.jpg`} alt="employee" />
        </div>
        <div className={style.msgContainer}>
          <div>
            <span>
              <Iconify color="secondary.main" icon="heroicons-user-circle" width={20} height={20} />
              Employee_PJO{' '}
            </span>
            Confirmed 4 days a week labor contract. Overtime allowance 1 day 100,000
          </div>
          <div>02/17/2022 at 11:54</div>
        </div>
      </section>
    </>
  );
}
