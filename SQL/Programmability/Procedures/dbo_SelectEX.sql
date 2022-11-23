SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
--select * from JournalEntry
--sp_columns JournalEntry
CREATE PROCEDURE [dbo].[SelectEX] -- exec DBO.SelectEX 'JournalEntry','ImbalanceAmount,AuditStatus,ClosePeriod'
@tablename as varchar(120) --= 'JournalEntry';
,@columnstoex as varchar(800)--= 'ImbalanceAmount,AuditStatus,ClosePeriod';
,@orderby as varchar(800) = ''
as
BEGIN
	declare @cols varchar(8000);
	select @cols = STUFF((select distinct ','+QUOTENAME(ColumnName)
	from 
	(
		SELECT      c.name  AS 'ColumnName'
					,t.name AS 'TableName'
					,EX.Item
		FROM        sys.columns c
		JOIN        sys.tables  t   ON c.object_id = t.object_id
		left join (
				select Item from dbo.DelimitedSplit8k(@columnstoex,',') split -- Split the exclusion list
				) as EX
		on C.name = EX.Item
		WHERE       t.name = @tablename
		and EX.Item is null
	) as needtranspose
	order by 1
	for XML Path(''),TYPE).value('.','NVARCHAR(MAX)'),1,1,'')

	declare @sql nvarchar(4000) = 'select ' + @cols + ' from ' + @tablename;
	print @sql
	EXEC sp_executesql @sql;
END
GO