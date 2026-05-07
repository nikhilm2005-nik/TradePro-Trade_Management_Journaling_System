const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { z } = require('zod');
const protect = require('../middleware/authMiddleware');

router.use(protect); 

const tradeSchema = z.object({
  ticker: z.string().min(1).max(15).toUpperCase(),
  direction: z.enum(['LONG', 'SHORT']),
  entryPrice: z.number().positive(),
  size: z.number().positive(),
  entryDate: z.string()
});

const returningFields = `id, ticker, direction, entry_price AS "entryPrice", exit_price AS "exitPrice", entry_date AS "entryDate", exit_date AS "exitDate", size, net_pnl AS "netPnL"`;

router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = `SELECT entry_date AS "entryDate", net_pnl AS "netPnL" FROM trades WHERE user_id = $1`;
    const params = [req.user.userId];
    if (startDate && endDate) { params.push(startDate, endDate); query += ` AND entry_date >= $2 AND entry_date <= $3`; }
    query += ` ORDER BY entry_date ASC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Database error' }); }
});

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const { startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT ${returningFields} FROM trades WHERE user_id = $1`;
    let countQuery = `SELECT COUNT(*) FROM trades WHERE user_id = $1`;
    const queryParams = [req.user.userId];

    if (search) { queryParams.push(`%${search}%`); query += ` AND ticker ILIKE $${queryParams.length}`; countQuery += ` AND ticker ILIKE $${queryParams.length}`; }
    if (startDate && endDate) { queryParams.push(startDate, endDate); query += ` AND entry_date >= $${queryParams.length - 1} AND entry_date <= $${queryParams.length}`; countQuery += ` AND entry_date >= $${queryParams.length - 1} AND entry_date <= $${queryParams.length}`; }
    query += ` ORDER BY entry_date DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

    const [dataResult, countResult] = await Promise.all([
      pool.query(query, [...queryParams, limit, offset]),
      pool.query(countQuery, queryParams.slice(0, queryParams.length))
    ]);

    res.json({ trades: dataResult.rows, total: parseInt(countResult.rows[0].count), page, totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit) });
  } catch (error) { res.status(500).json({ error: 'Database error' }); }
});

router.post('/', async (req, res) => {
  try {
    const v = tradeSchema.parse(req.body);
    const query = `INSERT INTO trades (ticker, direction, entry_price, size, entry_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${returningFields};`;
    const result = await pool.query(query, [v.ticker, v.direction, v.entryPrice, v.size, v.entryDate, req.user.userId]);
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Failed to add trade' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { exitPrice } = req.body;
    const tradeRes = await pool.query('SELECT * FROM trades WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    if (tradeRes.rows.length === 0) return res.status(404).json({ error: 'Trade not found' });
    const trade = tradeRes.rows[0];
    let netPnL = trade.direction === 'LONG' ? (exitPrice - trade.entry_price) * trade.size : (trade.entry_price - exitPrice) * trade.size;
    const result = await pool.query(`UPDATE trades SET exit_price = $1, exit_date = $2, net_pnl = $3 WHERE id = $4 RETURNING ${returningFields};`, [exitPrice, new Date().toISOString(), netPnL, req.params.id]);
    res.status(200).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Failed to close trade' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM trades WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.user.userId]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Trade not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error: 'Failed' }); }
});

module.exports = router;