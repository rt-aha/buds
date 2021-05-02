import styled from 'styled-components';
import dayjs from 'dayjs';
import { getBrief } from '@/utils/tools';
import { pipelineStatus } from '@/utils/converted';

const PipelineListItem = ({ item, className }: { item: any; className: string }) => {
  return (
    <li className={className}>
      <div className="pipeline-content">
        <div className="pipeline-content__item pipeline-content__item--updated">
          {dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss')}
        </div>
        <div className="pipeline-content__item pipeline-content__item--status">{pipelineStatus(item.status)}</div>
        <div className="pipeline-content__item pipeline-content__item--ref-sha">
          <p className="pipeline-content__item__ref-sha">ref: {item.ref}</p>
          <p className="pipeline-content__item__ref-sha">sha: {getBrief(item.sha, 8)}</p>
        </div>
      </div>
    </li>
  );
};

const StyledComp = styled(PipelineListItem).attrs({ className: 'pipeline-list-item' })`
  box-sizing: border-box;
  width: 100%;
  /* margin: 10px 0; */

  .pipeline-content {
    display: flex;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    padding: 10px 0;

    &__item {
      box-sizing: border-box;
      /* padding: 0 20px; */

      &--updated {
        flex: none;
        width: 200px;
      }

      &--status {
        flex: none;
        width: 100px;
      }

      &--ref-sha {
        flex: 1;
      }

      &__ref-sha {
        margin: 0;
      }
    }
  }
`;

export default StyledComp;
