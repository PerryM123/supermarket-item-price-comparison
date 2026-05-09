import { test, expect, type FileChooser } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

test.use({
  viewport: {
    width: 375,
    height: 667
  },
  deviceScaleFactor: 2
})

test('User can register a supermarket, item, and item price', async ({
  page
}) => {
  const storeName = 'A Store Name Here'
  const itemName = 'A Sample Item 1'
  await page.goto('http://local.super-price-check.com:8082/');
  await page.getByRole('link', { name: 'スーパー一覧', exact: true }).click();
  await page.getByRole('link', { name: 'スーパー追加' }).click();
  await page.getByRole('textbox', { name: 'スーパーの名前' }).click();
  await page.getByRole('textbox', { name: 'スーパーの名前' }).fill(storeName);
  await page.getByRole('button', { name: '保存' }).click();
  await expect(page.getByText(`${storeName}編集`)).toBeVisible();
  await page.getByRole('link', { name: 'いくらだったっけ？！' }).click();
  await page.getByRole('link', { name: '商品一覧', exact: true }).click();
  await page.getByRole('link', { name: '商品追加' }).click();
  await page.getByRole('textbox', { name: '商品名' }).click();
  await page.getByRole('textbox', { name: '商品名' }).fill(itemName);
  const addPhotoChooserPromise = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: '画像追加' }).click();
  const addPhotoChooser = await addPhotoChooserPromise
  await addPhotoChooser.setFiles(path.join(__dirname, 'fixtures/banana.png'));
  await page.getByRole('button', { name: '保存' }).click();
  await expect(page.getByRole('link', { name: itemName })).toBeVisible();
  await page.getByRole('link', { name: itemName }).click();
  await page.getByRole('link', { name: '商品詳細を編集' }).click();
  await expect(page.getByText('商品編集')).toBeVisible();
  await expect(page.getByRole('textbox', { name: '商品名' })).toHaveValue(itemName);
  await page.getByRole('textbox', { name: '商品名' }).click();
  await page.getByRole('textbox', { name: '商品名' }).fill(`${itemName} (Edited)`);
  await page.getByRole('button', { name: '保存' }).click();
  await expect(page.getByRole('heading', { name: `${itemName} (Edited)` })).toBeVisible();
  await page.getByRole('link', { name: 'スーパー＆価格を追加' }).click();
  await page.getByLabel('スーパーの名前').selectOption({ label: storeName });
  await page.getByRole('spinbutton', { name: '価格' }).click();
  await page.getByRole('spinbutton', { name: '価格' }).fill('199');
  await page.getByRole('button', { name: '保存' }).click();
  await expect(page.getByText(storeName)).toBeVisible();
  await expect(page.getByText('199円')).toBeVisible();
})
