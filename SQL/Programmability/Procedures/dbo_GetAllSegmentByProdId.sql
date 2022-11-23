SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetAllSegmentByProdId] -- GetAllSegmentByProdId 3,0
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@Mode int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @IsAccountExists nvarchar(50)
	set @IsAccountExists='No';
	if exists(select * from TblAccounts where ProdId=@ProdId)
	begin
	set @IsAccountExists='Yes';
	end
	

	if(@Mode=1)
	begin
	
	declare @check int 
	declare @Count int
		set @Count=(select Count(*)  from SegmentLedger  where ProdId=@ProdId)
	set @check=(select SegmentLevel  from SegmentLedger  where ProdId=@ProdId)
	if @Count=0
	begin
	set 
	@check=100;
	end

	select *,@IsAccountExists as IsAccountExists from Segment  where ProdId=@ProdId and SegmentLevel<@check

	union all
select *,'' as SubAccount1,'' as SubAccount2,'' as SubAccount3,'' as SubAccount4,'' as SubAccount5,'' as SubAccount6,@IsAccountExists as IsAccountExists from SegmentLedger where ProdId=@ProdId

union all

	select *,@IsAccountExists as IsAccountExists from Segment  where ProdId=@ProdId and SegmentLevel>@check-1


order by SegmentLevel
end
else
begin
select *,@IsAccountExists as IsAccountExists from Segment  where ProdId=@ProdId
end
END



GO