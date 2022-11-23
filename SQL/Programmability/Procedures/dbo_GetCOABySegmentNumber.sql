SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetCOABySegmentNumber] -- GetCOABySegmentNumber 3,2
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@Segment int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @DT varchar(20);
	
	if(@Segment=2)
	begin
	set @DT=(select classification   from segment where SegmentLevel=2 and Prodid=@ProdID);
	if(@DT='Detail')
	begin
		select distinct a.AccountCode as COANo,'' as Id  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where   COA.ProdId=@ProdID and a.Posting=1
	
	end
	else
	begin
	select distinct SS2 as COANo,'' as Id  from COA  where   ProdID=@ProdID and ss2<>''
	end
	end
	else if(@Segment=3)
	begin
	set @DT=(select classification   from segment where SegmentLevel=3 and Prodid=@ProdID);
	if(@DT='Detail')
	begin
		select distinct a.AccountCode as COANo,'' as Id  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where   COA.ProdId=@ProdID and a.Posting=1
	
	end
	else
	begin
	select distinct SS3 as COANo,'' as Id  from COA  where   ProdID=@ProdID and ss3<>''
	end
	end
	else if(@Segment=4)
	begin
	set @DT=(select classification   from segment where SegmentLevel=4 and Prodid=@ProdID);
	if(@DT='Detail')
	begin
		select distinct a.AccountCode as COANo,'' as Id  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where   COA.ProdId=@ProdID and a.Posting=1
	
	end
	else
	begin
	select distinct SS4 as COANo,'' as Id  from COA  where   ProdID=@ProdID and ss4<>''
	end
	end
	else if(@Segment=5)
	begin
	set @DT=(select classification   from segment where SegmentLevel=5 and Prodid=@ProdID);
	if(@DT='Detail')
	begin
		select distinct a.AccountCode as COANo,'' as Id  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where   COA.ProdId=@ProdID and a.Posting=1
	
	end
	else
	begin
	select distinct SS5 as COANo,'' as Id  from COA  where   ProdID=@ProdID and ss5<>''
	end
	end
	else if(@Segment=6)
	begin
	set @DT=(select classification   from segment where SegmentLevel=6 and Prodid=@ProdID);
	if(@DT='Detail')
	begin
		select distinct a.AccountCode as COANo,'' as Id  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where   COA.ProdId=@ProdID and a.Posting=1
	
	end
	else
	begin
	select distinct SS6 as COANo,'' as Id  from COA  where   ProdID=@ProdID and ss6<>''
	end
	end
	else if(@Segment=7)
	begin
	set @DT=(select classification   from segment where SegmentLevel=7 and Prodid=@ProdID);
	if(@DT='Detail')
	begin
		select distinct a.AccountCode as COANo,'' as Id  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where   COA.ProdId=@ProdID and a.Posting=1
	
	end
	else
	begin
	select distinct SS7 as COANo,'' as Id  from COA  where   ProdID=@ProdID and ss7<>''
	end
	end
	else if(@Segment=8)
	begin
	set @DT=(select classification   from segment where SegmentLevel=8 and Prodid=@ProdID);
	if(@DT='Detail')
	begin
		select distinct a.AccountCode as COANo,'' as Id  from COA inner Join tblaccounts a
	on a.AccountId=coa.AccountId   where   COA.ProdId=@ProdID and a.Posting=1
	
	end
	else
	begin
	select distinct SS8 as COANo,'' as Id  from COA  where   ProdID=@ProdID and ss8<>''
	end
	end
END



GO