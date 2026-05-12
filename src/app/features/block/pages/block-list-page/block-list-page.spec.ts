import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BlockService } from '../../../../core/services/block/block.service';
import { BlockListPage } from './block-list-page';

describe('BlockListPage', () => {
  let fixture: ComponentFixture<BlockListPage>;
  const blockService = {
    page: vi.fn(),
  };

  beforeEach(async () => {
    blockService.page.mockReturnValue(
      of({
        content: [blockResponse()],
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
      }),
    );

    await TestBed.configureTestingModule({
      imports: [BlockListPage],
      providers: [provideRouter([]), { provide: BlockService, useValue: blockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockListPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and render blocks', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.textContent).toContain('Blocos imutáveis de liquidação');
    expect(element.textContent).toContain('#1');
    expect(blockService.page).toHaveBeenCalledWith(0, 20);
  });

  it('should render error state', async () => {
    blockService.page.mockReturnValue(throwError(() => new Error('failed')));
    const errorFixture = TestBed.createComponent(BlockListPage);
    errorFixture.detectChanges();
    await errorFixture.whenStable();

    expect((errorFixture.nativeElement as HTMLElement).textContent).toContain('Não foi possível carregar os blocos');
  });
});

function blockResponse() {
  return {
    id: 'block-1',
    index: 1,
    hash: 'hash-1',
    previousHash: 'hash-0',
    merkleRoot: 'root',
    nonce: 42,
    difficulty: 3,
    createdAt: '2026-05-11T10:00:00Z',
    minedAt: '2026-05-11T10:01:00Z',
    transactionsCount: 2,
  };
}
