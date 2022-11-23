SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[DeleteTblAccountById]
	-- Add the parameters for the stored procedure here
@AccountId int,
@SegmentType nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if(@SegmentType='Ledger')
	begin
	if exists(select * from TblAccounts where parentid=@AccountId and SegmentType='detail' and SubLevel=1)
begin
select 1;
end
else
begin
delete from LedgerAccounts where LedgerId=@AccountId
select 0;
end
	end
	else 
	begin
if exists(select * from COA where AccountId=@AccountId)
begin
select 1;
end
else if exists (select * from TblAccounts where ParentId=@AccountId and SegmentType='Detail' and SubLevel>1)
begin
select 2;
end
else
begin
delete from TblAccounts where AccountId=@AccountId
select 0;
end
end

END


GO